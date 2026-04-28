/**
 * Sample File Tree Data for SecureVault
 * 
 * This provides realistic test data that matches the structure
 * shown in the screenshots, with various file types and encryption states
 */

import { FileTreeData, FileNode } from '../types';

/**
 * Creates sample file tree data for development and testing
 */
export function createSampleFileTree(): FileTreeData {
  const sampleFiles: FileNode = {
    id: 'root',
    name: 'Vault',
    type: 'folder',
    children: [
      {
        id: 'legal',
        name: 'Legal',
        type: 'folder',
        children: [
          {
            id: 'case-files',
            name: 'Case Files',
            type: 'folder',
            children: [
              {
                id: 'deposition-2024',
                name: 'Deposition_2024.pdf',
                type: 'file',
                fileType: 'pdf',
                size: 2400000, // 2.4 MB
                modified: new Date('2024-11-12'),
                owner: 'Jane Cooper',
                encrypted: true
              },
              {
                id: 'witness-statements',
                name: 'Witness_Statements.docx',
                type: 'file',
                fileType: 'docx',
                size: 850000, // 850 KB
                modified: new Date('2024-11-10'),
                owner: 'John Smith',
                encrypted: true
              }
            ]
          },
          {
            id: 'contracts',
            name: 'Contracts',
            type: 'folder',
            children: [
              {
                id: 'nda-template',
                name: 'NDA_Template.pdf',
                type: 'file',
                fileType: 'pdf',
                size: 125000, // 125 KB
                modified: new Date('2024-10-15'),
                owner: 'Legal Team',
                encrypted: false
              }
            ]
          }
        ]
      },
      {
        id: 'finance',
        name: 'Finance',
        type: 'folder',
        children: [
          {
            id: 'reports',
            name: 'Reports',
            type: 'folder',
            children: [
              {
                id: 'q3-2024',
                name: 'Q3_2024_Report.xlsx',
                type: 'file',
                fileType: 'xlsx',
                size: 1200000, // 1.2 MB
                modified: new Date('2024-10-01'),
                owner: 'Finance Team',
                encrypted: true
              }
            ]
          },
          {
            id: 'invoices',
            name: 'Invoices',
            type: 'folder',
            children: [
              {
                id: 'invoice-001',
                name: 'Invoice_001.pdf',
                type: 'file',
                fileType: 'pdf',
                size: 95000, // 95 KB
                modified: new Date('2024-11-01'),
                owner: 'Accounting',
                encrypted: false
              },
              {
                id: 'invoice-002',
                name: 'Invoice_002.pdf',
                type: 'file',
                fileType: 'pdf',
                size: 87000, // 87 KB
                modified: new Date('2024-11-05'),
                owner: 'Accounting',
                encrypted: false
              }
            ]
          }
        ]
      },
      {
        id: 'hr',
        name: 'Human Resources',
        type: 'folder',
        children: [
          {
            id: 'employee-records',
            name: 'Employee Records',
            type: 'folder',
            children: [
              {
                id: 'handbook',
                name: 'Employee_Handbook.pdf',
                type: 'file',
                fileType: 'pdf',
                size: 2800000, // 2.8 MB
                modified: new Date('2024-09-15'),
                owner: 'HR Department',
                encrypted: true
              }
            ]
          }
        ]
      },
      {
        id: 'it',
        name: 'IT & Security',
        type: 'folder',
        children: [
          {
            id: 'system-configs',
            name: 'System_Configs',
            type: 'folder',
            children: [
              {
                id: 'server-config',
                name: 'server_config.json',
                type: 'file',
                fileType: 'json',
                size: 15000, // 15 KB
                modified: new Date('2024-11-08'),
                owner: 'IT Admin',
                encrypted: true
              },
              {
                id: 'env-production',
                name: 'env.production.yml',
                type: 'file',
                fileType: 'yml',
                size: 8500, // 8.5 KB
                modified: new Date('2024-11-12'),
                owner: 'DevOps',
                encrypted: true
              }
            ]
          },
          {
            id: 'security-keys',
            name: 'Security Keys',
            type: 'folder',
            children: [
              {
                id: 'master-key',
                name: 'master_key_v2.pem',
                type: 'file',
                fileType: 'pem',
                size: 4096, // 4 KB
                modified: new Date('2024-10-20'),
                owner: 'Security Team',
                encrypted: true
              }
            ]
          },
          {
            id: 'middleware',
            name: 'Middleware',
            type: 'folder',
            children: [
              {
                id: 'auth-middleware',
                name: 'auth_middleware.js',
                type: 'file',
                fileType: 'js',
                size: 25600, // 25.6 KB
                modified: new Date('2024-11-11'),
                owner: 'Backend Team',
                encrypted: false
              }
            ]
          },
          {
            id: 'audit-logs',
            name: 'Audit Logs',
            type: 'folder',
            children: [
              {
                id: 'user-audit-log',
                name: 'user_audit_log.db',
                type: 'file',
                fileType: 'db',
                size: 13500000, // 13.5 MB
                modified: new Date('2024-11-12'),
                owner: 'System',
                encrypted: false
              }
            ]
          }
        ]
      }
    ]
  };

  // Calculate totals
  const totals = calculateTreeTotals(sampleFiles);

  return {
    root: sampleFiles,
    totalFiles: totals.fileCount,
    totalSize: totals.totalSize,
    lastModified: totals.lastModified
  };
}

/**
 * Recursively calculates totals for the file tree
 */
function calculateTreeTotals(node: FileNode): {
  fileCount: number;
  totalSize: number;
  lastModified: Date;
} {
  let fileCount = 0;
  let totalSize = 0;
  let lastModified = new Date(0); // Start with epoch

  if (node.type === 'file') {
    fileCount = 1;
    totalSize = node.size || 0;
    lastModified = node.modified || new Date();
  } else if (node.children) {
    for (const child of node.children) {
      const childTotals = calculateTreeTotals(child);
      fileCount += childTotals.fileCount;
      totalSize += childTotals.totalSize;
      
      if (childTotals.lastModified > lastModified) {
        lastModified = childTotals.lastModified;
      }
    }
  }

  return { fileCount, totalSize, lastModified };
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Formats date in a user-friendly way
 */
export function formatDate(date: Date): string {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}