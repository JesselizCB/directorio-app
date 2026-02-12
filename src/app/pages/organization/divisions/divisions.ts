import { Component, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DivisionsTable } from '../../../components/table/table';

interface ColumnOption {
  name: string;
}

@Component({
  selector: 'app-divisions',
  imports: [
    NzRadioModule, 
    FormsModule, 
    NzSelectModule, 
    NzInputDirective, 
    NzIconModule,
    DivisionsTable
  ],
  templateUrl: './divisions.html',
  styleUrl: './divisions.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Divisions {
  radioValue = signal<'list' | 'tree'>('list');
  selectedColumn = signal<string>('');
  inputSearch = signal<string>('');
  columnsOptions = signal<ColumnOption[]>([
    { name: 'División' },
    { name: 'División Superior' },
    { name: 'Colaboradores' },
    { name: 'Nivel' },
    { name: 'Subdivisiones' },
    { name: 'Embajadores' },
  ]);

  onRadioChange(value: 'list' | 'tree'): void {
    this.radioValue.set(value);
  }

  onColumnSelect(value: string): void {
    this.selectedColumn.set(value);
  }

  onInputSearch(value: string): void {
    this.inputSearch.set(value);
  }
}
