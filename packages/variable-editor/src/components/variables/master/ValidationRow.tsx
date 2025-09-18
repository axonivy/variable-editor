import { cn, MessageRow, SelectRow, TableCell } from '@axonivy/ui-components';
import type { Severity, ValidationMessages } from '@axonivy/variable-editor-protocol';
import { flexRender, type Row } from '@tanstack/react-table';
import type { VirtualItem } from '@tanstack/react-virtual';
import type { Variable } from '../data/variable';
import { ROW_HEIGHT } from './VariablesMasterContent';

type ValidationRowProps = {
  row: Row<Variable>;
  virtualRow: VirtualItem;
};

export const ValidationRow = ({ row, virtualRow }: ValidationRowProps) => {
  return (
    <>
      <SelectRow
        row={row}
        className={cn('absolute flex h-[32px] w-full items-center', rowClass(row.original.validations))}
        style={{
          transform: `translateY(${virtualRow.start}px)`
        }}
        vindex={virtualRow.index}
      >
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </SelectRow>
      {row.original.validations?.map((val, index) => (
        <MessageRow
          key={index}
          className='absolute flex h-[32px] w-full items-center'
          columnCount={2}
          message={{ message: val.message, variant: val.severity.toLocaleLowerCase() as Lowercase<Severity> }}
          singleLine
          style={{
            transform: `translateY(${virtualRow.start + ROW_HEIGHT * (index + 1)}px)`
          }}
        />
      ))}
    </>
  );
};

export const rowClass = (validations?: ValidationMessages) => {
  if (!validations) {
    return '';
  }
  if (validations.find(message => message.severity === 'ERROR')) {
    return cn('w-[calc(100%_-_2px)] border! border-error!');
  }
  if (validations.find(message => message.severity === 'WARNING')) {
    return cn('w-[calc(100%_-_2px)] border! border-warning!');
  }
  return '';
};
