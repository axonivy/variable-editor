import { selectRow, useTableGlobalFilter } from '@axonivy/ui-components';
import type { Row, Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { getNode, getNodesOnPath, removeNode } from './tree-data';
import type { DeleteFirstSelectedRowReturnType, TreeNode, TreePath } from './types';

export const deleteFirstSelectedRow = <TNode extends TreeNode<TNode>>(
  table: Table<TNode>,
  data: Array<TNode>
): DeleteFirstSelectedRowReturnType<TNode> => {
  const selectedRow = table.getSelectedRowModel().flatRows[0];
  const newData = removeNode(data, getPathOfRow(selectedRow));
  let selectedVariablePath: TreePath;
  if (!selectedRow) {
    selectedVariablePath = [];
  } else {
    selectedVariablePath = adjustSelectionAfterDeletionOfRow(newData, table, selectedRow);
  }
  return { newData: newData, selectedPath: selectedVariablePath };
};

export const getPathOfRow = <TNode extends TreeNode<TNode>>(row?: Row<TNode>) => {
  if (!row) {
    return [];
  }
  return toTreePath(row.id);
};

const getPathOfParentRow = <TNode extends TreeNode<TNode>>(row?: Row<TNode>) => {
  if (!row || !row.parentId) {
    return [];
  }
  return toTreePath(row.parentId);
};

const adjustSelectionAfterDeletionOfRow = <TNode extends TreeNode<TNode>>(data: Array<TNode>, table: Table<TNode>, row: Row<TNode>) => {
  const parentPath = getPathOfParentRow(row);
  const parentNode = getNode(data, parentPath);
  const children = parentNode ? parentNode.children : data;
  const childIndex = row.index;

  let selectedRowPath;
  switch (children.length) {
    // node was the last remaining child of its parent -> select parent
    case 0:
      selectedRowPath = parentPath;
      break;
    // node is the last child in the list of children of its parent -> select previous child
    case childIndex:
      selectedRowPath = [...parentPath, childIndex - 1];
      break;
    // default case -> select next child
    default:
      selectedRowPath = [...parentPath, childIndex];
      break;
  }
  selectRow(table, toRowId(selectedRowPath));
  return selectedRowPath;
};

export const toTreePath = (rowId: string | undefined) => {
  if (!rowId) {
    return [];
  }
  return rowId.split('.').map(Number);
};

export const toRowId = (path: TreePath) => {
  return path.join('.');
};

export const useTreeGlobalFilter = <TNode extends TreeNode<TNode>>(data: Array<TNode>) => {
  const { t } = useTranslation();
  const globalFilter = useTableGlobalFilter({ searchPlaceholder: t('common.label.search') });
  const globalFilterFn = (row: Row<TNode>, _columnId: string, filterValue: string) =>
    treeGlobalFilter(data, toTreePath(row.id), filterValue);
  return { ...globalFilter, options: { ...globalFilter.options, globalFilterFn: globalFilterFn, filterFromLeafRows: true } };
};

export const treeGlobalFilter = <TNode extends TreeNode<TNode>>(data: Array<TNode>, path: TreePath, filterValue: string) => {
  filterValue = filterValue.toLowerCase();
  const nodesOnPath = getNodesOnPath(data, path);
  for (const node of nodesOnPath) {
    if (node?.name.toLowerCase().includes(filterValue)) {
      return true;
    }
  }
  const node = nodesOnPath.at(-1);
  if (node) {
    return node.value.toLowerCase().includes(filterValue);
  }
  return false;
};

export const newNodeName = <TNode extends TreeNode<TNode>>(table: Table<TNode>, baseName: string) => {
  const takenNames = subRowsOfFirstSelectedNonLeafRow(table).map(row => row.original.name);
  let newName = baseName;
  let index = 2;
  while (takenNames.includes(newName)) {
    newName = `${baseName}${index}`;
    index++;
  }
  return newName;
};

const subRowsOfFirstSelectedNonLeafRow = <TNode extends TreeNode<TNode>>(table: Table<TNode>) => {
  const row = firstSelectedNonLeafRow(table);
  if (!row) {
    return table.getRowModel().rows;
  }
  return row.subRows;
};

export const keyOfFirstSelectedNonLeafRow = <TNode extends TreeNode<TNode>>(table: Table<TNode>) => {
  const row = firstSelectedNonLeafRow(table);
  if (!row) {
    return '';
  }
  return keyOfRow(row);
};

const firstSelectedNonLeafRow = <TNode extends TreeNode<TNode>>(table: Table<TNode>) => {
  const selectedRow = table.getSelectedRowModel().flatRows[0];
  if (!selectedRow) {
    return;
  }
  if (hasChildren(selectedRow)) {
    return selectedRow;
  }

  const parentRow = selectedRow.getParentRow();
  if (!parentRow) {
    return;
  }
  return parentRow;
};

export const keysOfAllNonLeafRows = <TNode extends TreeNode<TNode>>(table: Table<TNode>) => {
  return table.getRowModel().flatRows.filter(hasChildren).map(keyOfRow);
};

const hasChildren = <TNode extends TreeNode<TNode>>(row: Row<TNode>) => {
  return row.subRows.length !== 0;
};

export const keyOfRow = <TNode extends TreeNode<TNode>>(row: Row<TNode>) => {
  const parentKey = keyOfParentRows(row);
  if (parentKey !== '') {
    return parentKey + '.' + row.original.name;
  }
  return row.original.name;
};

const keyOfParentRows = <TNode extends TreeNode<TNode>>(row: Row<TNode>) => {
  return row
    .getParentRows()
    .map(parentRow => parentRow.original.name)
    .join('.');
};

export const subRowNamesOfRow = <TNode extends TreeNode<TNode>>(key: string, table: Table<TNode>) => {
  return subRowsOfRow(key, table).map(row => row.original.name);
};

const subRowsOfRow = <TNode extends TreeNode<TNode>>(key: string, table: Table<TNode>) => {
  let currentSubRows = table.getCoreRowModel().rows;
  if (key === '') {
    return currentSubRows;
  }

  for (const keyPart of key.split('.')) {
    const nextRow = currentSubRows.find(row => row.original.name === keyPart);
    if (nextRow === undefined) {
      return [];
    }
    currentSubRows = nextRow.subRows;
  }
  return currentSubRows;
};
