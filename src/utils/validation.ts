import type { FileNode, FileTreeData, ValidationResult, VaultError } from '../types';


export function validateFileNode(node: any, path: string[] = []): VaultError[] {
  const errors: VaultError[] = [];
  const currentPath = path.length > 0 ? path.join(' > ') : 'root';


  if (!node) {
    errors.push({
      code: 'NODE_MISSING',
      message: `File node is missing at path: ${currentPath}`,
      timestamp: new Date()
    });
    return errors;
  }

  if (!node.id || typeof node.id !== 'string') {
    errors.push({
      code: 'INVALID_ID',
      message: `File node must have a valid string ID at path: ${currentPath}`,
      details: { receivedId: node.id, path: currentPath },
      timestamp: new Date()
    });
  }

  if (!node.name || typeof node.name !== 'string') {
    errors.push({
      code: 'INVALID_NAME',
      message: `File node must have a valid string name at path: ${currentPath}`,
      details: { receivedName: node.name, path: currentPath },
      timestamp: new Date()
    });
  }

  if (!node.type || !['file', 'folder'].includes(node.type)) {
    errors.push({
      code: 'INVALID_TYPE',
      message: `File node type must be either 'file' or 'folder' at path: ${currentPath}`,
      details: { receivedType: node.type, path: currentPath },
      timestamp: new Date()
    });
  }


  if (node.type === 'file') {

    if (node.children && node.children.length > 0) {
      errors.push({
        code: 'FILE_HAS_CHILDREN',
        message: `Files cannot have children at path: ${currentPath}`,
        details: { childCount: node.children.length, path: currentPath },
        timestamp: new Date()
      });
    }

    if (node.size !== undefined && (typeof node.size !== 'number' || node.size < 0)) {
      errors.push({
        code: 'INVALID_FILE_SIZE',
        message: `File size must be a non-negative number at path: ${currentPath}`,
        details: { receivedSize: node.size, path: currentPath },
        timestamp: new Date()
      });
    }

    if (node.encrypted !== undefined && typeof node.encrypted !== 'boolean') {
      errors.push({
        code: 'INVALID_ENCRYPTION_FLAG',
        message: `Encryption flag must be a boolean at path: ${currentPath}`,
        details: { receivedEncrypted: node.encrypted, path: currentPath },
        timestamp: new Date()
      });
    }
  }

  if (node.type === 'folder') {
    // Validate children if present
    if (node.children) {
      if (!Array.isArray(node.children)) {
        errors.push({
          code: 'INVALID_CHILDREN',
          message: `Folder children must be an array at path: ${currentPath}`,
          details: { receivedChildren: typeof node.children, path: currentPath },
          timestamp: new Date()
        });
      } else {
        // Recursively validate each child
        node.children.forEach((child: any, index: number) => {
          const childPath = [...path, node.name || `item-${index}`];
          const childErrors = validateFileNode(child, childPath);
          errors.push(...childErrors);
        });
      }
    }
  }

  return errors;
}

/**
 * Validates the complete file tree data structure
 * Ensures the root exists and all nodes are valid
 */
export function validateFileTree(data: any): ValidationResult {
  const errors: VaultError[] = [];
  const warnings: VaultError[] = [];

  // Check if data exists
  if (!data) {
    return {
      isValid: false,
      errors: [{
        code: 'MISSING_DATA',
        message: 'File tree data is missing or null',
        timestamp: new Date()
      }],
      warnings: []
    };
  }

  // Validate root node
  if (!data.root) {
    errors.push({
      code: 'MISSING_ROOT',
      message: 'File tree must have a root node',
      timestamp: new Date()
    });
  } else {
    // Validate the entire tree starting from root
    const rootErrors = validateFileNode(data.root, []);
    errors.push(...rootErrors);
  }

  // Validate metadata properties
  if (data.totalFiles !== undefined && (typeof data.totalFiles !== 'number' || data.totalFiles < 0)) {
    warnings.push({
      code: 'INVALID_TOTAL_FILES',
      message: 'Total files count should be a non-negative number',
      details: { receivedTotalFiles: data.totalFiles },
      timestamp: new Date()
    });
  }

  if (data.totalSize !== undefined && (typeof data.totalSize !== 'number' || data.totalSize < 0)) {
    warnings.push({
      code: 'INVALID_TOTAL_SIZE',
      message: 'Total size should be a non-negative number',
      details: { receivedTotalSize: data.totalSize },
      timestamp: new Date()
    });
  }

  if (data.lastModified !== undefined && !(data.lastModified instanceof Date) && !isValidDateString(data.lastModified)) {
    warnings.push({
      code: 'INVALID_LAST_MODIFIED',
      message: 'Last modified should be a valid Date object or date string',
      details: { receivedLastModified: data.lastModified },
      timestamp: new Date()
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Checks if a string represents a valid date
 */
function isValidDateString(dateString: any): boolean {
  if (typeof dateString !== 'string') return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Sanitizes file tree data by providing default values for missing properties
 * This helps ensure the application doesn't crash with incomplete data
 */
export function sanitizeFileTree(data: any): FileTreeData {
  // Provide defaults for missing top-level properties
  const sanitized: FileTreeData = {
    root: sanitizeFileNode(data?.root || { id: 'root', name: 'Root', type: 'folder', children: [] }),
    totalFiles: typeof data?.totalFiles === 'number' ? data.totalFiles : 0,
    totalSize: typeof data?.totalSize === 'number' ? data.totalSize : 0,
    lastModified: data?.lastModified instanceof Date ? data.lastModified : new Date()
  };

  return sanitized;
}

/**
 * Sanitizes a single file node by providing defaults for missing properties
 */
function sanitizeFileNode(node: any): FileNode {
  const sanitized: FileNode = {
    id: node?.id || `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: node?.name || 'Unnamed',
    type: ['file', 'folder'].includes(node?.type) ? node.type : 'file'
  };

  // Add file-specific properties
  if (sanitized.type === 'file') {
    if (node?.fileType && typeof node.fileType === 'string') {
      sanitized.fileType = node.fileType;
    }
    if (typeof node?.size === 'number' && node.size >= 0) {
      sanitized.size = node.size;
    }
    if (node?.modified instanceof Date) {
      sanitized.modified = node.modified;
    } else if (typeof node?.modified === 'string' && isValidDateString(node.modified)) {
      sanitized.modified = new Date(node.modified);
    }
    if (typeof node?.owner === 'string') {
      sanitized.owner = node.owner;
    }
    if (typeof node?.encrypted === 'boolean') {
      sanitized.encrypted = node.encrypted;
    }
  }

  // Add folder-specific properties
  if (sanitized.type === 'folder' && Array.isArray(node?.children)) {
    sanitized.children = node.children.map(sanitizeFileNode);
  }

  return sanitized;
}

/**
 * Checks if two file nodes are equal (useful for React optimization)
 */
export function areFileNodesEqual(nodeA: FileNode, nodeB: FileNode): boolean {
  if (nodeA.id !== nodeB.id) return false;
  if (nodeA.name !== nodeB.name) return false;
  if (nodeA.type !== nodeB.type) return false;
  if (nodeA.size !== nodeB.size) return false;
  if (nodeA.encrypted !== nodeB.encrypted) return false;

  // Compare modification dates
  if (nodeA.modified?.getTime() !== nodeB.modified?.getTime()) return false;

  // Compare children count (don't deep compare for performance)
  if ((nodeA.children?.length || 0) !== (nodeB.children?.length || 0)) return false;

  return true;
}

/**
 * Creates a user-friendly error message from validation errors
 */
export function formatValidationErrors(errors: VaultError[]): string {
  if (errors.length === 0) return '';

  if (errors.length === 1) {
    return `Validation Error: ${errors[0].message}`;
  }

  return `Multiple Validation Errors:\n${errors.map((error, index) =>
    `${index + 1}. ${error.message}`
  ).join('\n')}`;
}