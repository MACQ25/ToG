
export interface switchChip {
  fromId: string | number;
  previousIndex: number;
}

export interface dragChip extends switchChip {
  toId: string | number;
  currentIndex: number;
  data: any;
}
