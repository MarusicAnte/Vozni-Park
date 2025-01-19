export interface IVehicle {
  _id: string;
  imageURL: string;
  model: string;
  year: number;
  category: {
    _id: string;
    name: string;
  };
  vin: string;
  isAvaiable: boolean;
}

export interface IVehicleCategory {
  _id: string;
  name: string;
}

export interface IUser {
  _id: string;
  imageURL: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface ITableColumn {
  key: string;
  name: string;
}

export interface IAppDataTableProps<T> {
  tableName?: string;
  columns: Array<ITableColumn>;
  addButtonName?: string;
  data: Array<T>;
  onAddButtonClick?: () => void;
  onUpdateButtonClick?: (item: T) => void;
  onDeleteButtonClick?: (item: T) => void;
  onApproveButtonClick?: (item: T) => void;
  onRejectButtonClick?: (item: T) => void;
  onCancelButtonClick?: (item: T) => void;
  onFixButtonClick?: (item: T) => void;
  onFailureReportButtonClick?: (item: T) => void;
}

export interface IAvailableSelectOption {
  value: boolean;
  label: string;
}

export interface ISelectOption {
  value: string;
  label: string;
  category?: string;
}

export interface IFormField {
  label: string;
  name: string;
  type: string;
  value: string | ISelectOption;
  placeholder?: string;
  options?: { label: string; value: string }[];
  getOptions?: () => Promise<
    { label: string; value: string; category?: string }[]
  >;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  disabledDates?: Array<Date>;
  disabled?: boolean;
}

export interface ITableRow<T> {
  tableName: string | undefined;
  data: T;
  columns: Array<ITableColumn>;
  onUpdate?: (data: T) => void;
  onDelete?: (data: T) => void;
  onApprove?: (data: T) => void;
  onReject?: (data: T) => void;
  onCancel?: (data: T) => void;
  onFix?: (data: T) => void;
  onFaliureReport?: (data: T) => void;
}

export interface IDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  title: string;
  message: string;
}

export interface ICreateNewReservationData {
  purpose: string;
  start: Date;
  end: Date;
  vehicleCategory: string;
}

export interface INewReservation {
  _id: string;
  purpose: string;
  period: {
    start: Date;
    end: Date;
  };
  vehicleCategory: {
    name: string;
    _id: string;
  };
  status: string;
  user: {
    _id: string;
    name: string;
  };
  vehicle?: string;
  reasonForRejection?: string;
}

export interface IApprovedReservation {
  _id: string;
  purpose: string;
  period: {
    start: Date;
    end: Date;
  };
  vehicleCategory: {
    _id: string;
    name: string;
  };
  status: string;
  user: {
    _id: string;
    email: string;
  };
  vehicle: {
    model: string;
    _id: string;
  };
}

export interface IApprovedReservationDTO {
  _id: string;
  purpose: string;
  period: {
    start: Date;
    end: Date;
  };
  vehicleCategory: string;
  status: string;
  user: string;
  vehicle: string;
}

export interface IRejectedReservation {
  _id: string;
  purpose: string;
  period: {
    start: Date;
    end: Date;
  };
  vehicleCategory: {
    _id: string;
    label: string;
  };
  status: string;
  user: {
    _id: string;
    email: string;
  };
  reasonForRejection?: string;
}

export interface IRejectedReservationDto {
  _id: string;
  purpose: string;
  period: {
    start: Date;
    end: Date;
  };
  vehicleCategory: string;
  status: string;
  user: string;
  reasonForRejection?: string;
}

export interface IFinishedReservation {
  _id: string;
  purpose: string;
  period: {
    start: Date;
    end: Date;
  };
  vehicleCategory: {
    _id: string;
    name: string;
  };
  vehicle?: {
    _id: string;
    model: string;
  };
  status: string;
  user: {
    _id: string;
    email: string;
  };
  reasonForRejection?: string;
}

export interface IModalProps {
  isOpen: boolean;
  title: string;
  formSchema: Array<IFormField>;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
  vehicleCategory?: string;
  approvedReservations?: Array<IApprovedReservation>;
}

export interface IHasId {
  _id: string;
}

export interface ITableFilter {
  label: string;
  setFunction: React.Dispatch<React.SetStateAction<IFilterSelectedOptions>>;
  getFilterOptions?: (categoryId?: string) => Promise<Array<ISelectOption>>;
}

export interface IFilterSelectedOptions {
  vehicleCategory?: ISelectOption;
  user?: ISelectOption;
  vehicle?: ISelectOption;
  availability?: ISelectOption;
}

export interface IVehicleMalfunction {
  _id: string;
  vehicle: {
    _id: string;
    model: string;
    year: number;
    category: {
      _id: string;
      name: string;
    };
    vin: string;
  };
  description: string;
  user: {
    _id: string;
    email: string;
  };
  createdAt: Date;
}

export interface IVehicleMalfunctionCreateDto {
  vehicle: string;
  description: string;
  user: string;
}

export interface IConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  message: string;
}
