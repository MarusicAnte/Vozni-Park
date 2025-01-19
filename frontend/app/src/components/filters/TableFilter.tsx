import { useEffect, useState } from "react";
import Select from "react-select";
import {
  IAvailableSelectOption,
  ISelectOption,
  ITableFilter,
} from "../../types";

function TableFilter({ label, setFunction, getFilterOptions }: ITableFilter) {
  const [filterOptions, setFilterOptions] = useState<Array<ISelectOption>>([]);
  const [selectedOption, setSelectedOption] = useState<
    ISelectOption | IAvailableSelectOption | null
  >(null);

  useEffect(() => {
    const fetchOptions = async () => {
      const data = getFilterOptions && (await getFilterOptions());
      if (data) {
        setFilterOptions(data);
      }
    };

    fetchOptions();
  }, [getFilterOptions]);

  const handleChange = (
    selected: ISelectOption | IAvailableSelectOption | null
  ) => {
    setSelectedOption(selected);

    setFunction((prevState: any) => ({
      ...prevState,
      [mapLabelToStateKey(label)]: selected,
    }));
  };

  const mapLabelToStateKey = (label: string): string => {
    switch (label) {
      case "Kategorija vozila":
        return "vehicleCategory";
      case "Vozilo":
        return "vehicle";
      case "Korisnik":
        return "user";
      case "Dostupnost":
        return "availability";
      default:
        console.warn(`Nije pronađen odgovarajući ključ za label: ${label}`);
        return "unknown";
    }
  };

  return (
    <div className="flex flex-col items-start w-[30%] px-2 mb-2">
      <label className="text-lg font-semibold text-white">{label}:</label>
      <Select
        options={filterOptions}
        value={selectedOption}
        onChange={handleChange}
        isMulti={false}
        isClearable={true}
        placeholder="Izaberite opciju"
        className="w-full"
      />
    </div>
  );
}

export default TableFilter;
