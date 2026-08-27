import {
  addRow,
  BasicField,
  Button,
  dataTableHelper,
  deleteFirstSelectedRow,
  Flex,
  InputCell,
  SelectRow,
  Separator,
  Table,
  TableBody,
  TableCell,
  useReadonly
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toEnumMetadataUpdate } from '../data/metadata';
import { type VariableUpdates } from '../data/variable';

type EnumValuesProps = {
  selectedValue: string;
  values: Array<string>;
  onChange: (updates: VariableUpdates) => void;
};

type EnumValue = { value: string };

const { columnHelper, tableOptions } = dataTableHelper<EnumValue>();
const columns = columnHelper.columns([
  columnHelper.accessor('value', {
    header: 'Value',
    cell: cell => <InputCell cell={cell} />
  })
]);

export const EnumValues = ({ selectedValue: value, values, onChange }: EnumValuesProps) => {
  const { t } = useTranslation();
  const data = useMemo(() => values.map(value => ({ value })), [values]);
  const meta = {
    updateData: (rowId: string, _columnId: string, value: unknown) => {
      if (typeof value !== 'string') {
        return;
      }
      if (values.includes(value)) {
        return;
      }
      const newValues = data.map((row, index) => (index === Number(rowId) ? { value } : row));
      onChange([toEnumMetadataUpdate(newValues.map(row => row.value))]);
    }
  };
  const table = useTable({
    ...tableOptions,
    data,
    columns,
    meta
  });

  const addValue = () => {
    const newValues = addRow(table, data, { value: '' });
    onChange([toEnumMetadataUpdate(newValues.map(row => row.value))]);
  };

  const deleteValue = () => {
    const { newData } = deleteFirstSelectedRow(table, data);
    const newValues = newData.map(row => row.value);
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
      <Separator decorative orientation='vertical' className='m-0! h-5!' />
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
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </SelectRow>
          ))}
        </TableBody>
      </Table>
    </BasicField>
  );
};
