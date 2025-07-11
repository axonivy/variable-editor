import {
  addRow,
  BasicField,
  Button,
  deleteFirstSelectedRow,
  Flex,
  InputCell,
  SelectRow,
  Separator,
  Table,
  TableBody,
  TableCell,
  updateRowData,
  useReadonly,
  useTableSelect
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { toEnumMetadataUpdate } from '../data/metadata';
import { type VariableUpdates } from '../data/variable';

type EnumValuesProps = {
  selectedValue: string;
  values: Array<string>;
  onChange: (updates: VariableUpdates) => void;
};

export const EnumValues = ({ selectedValue: value, values, onChange }: EnumValuesProps) => {
  const { t } = useTranslation();
  const selection = useTableSelect<string>();
  const columns: Array<ColumnDef<string, string>> = [
    {
      accessorFn: (value: string) => value,
      header: 'Value',
      cell: cell => <InputCell cell={cell} />
    }
  ];
  const meta = {
    updateData: (rowId: string, _columnId: string, value: string) => {
      if (values.includes(value)) {
        return;
      }
      const newValues = updateRowData(values, Number(rowId), value);
      onChange([toEnumMetadataUpdate(newValues)]);
    }
  };
  const table = useReactTable({
    ...selection.options,
    data: values,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState
    },
    meta: meta
  });

  const addValue = () => {
    const newValues = addRow(table, values, '');
    onChange([toEnumMetadataUpdate(newValues)]);
  };

  const deleteValue = () => {
    const { newData: newValues } = deleteFirstSelectedRow(table, values);
    const updates: VariableUpdates = [toEnumMetadataUpdate(newValues)];
    if (!newValues.includes(value)) {
      updates.push({ key: 'value', value: '' });
    }
    onChange(updates);
  };

  const readonly = useReadonly();
  const control = readonly ? null : (
    <Flex gap={2}>
      <Button key='addButton' icon={IvyIcons.Plus} onClick={addValue} aria-label={t('label.addValue')} />
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <Button
        key='deleteButton'
        icon={IvyIcons.Trash}
        onClick={deleteValue}
        disabled={!table.getIsSomeRowsSelected()}
        aria-label={t('label.deleteValue')}
      />
    </Flex>
  );

  return (
    <BasicField label={t('label.listOfValues')} control={control}>
      <Table>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <SelectRow key={row.id} row={row}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </SelectRow>
          ))}
        </TableBody>
      </Table>
    </BasicField>
  );
};
