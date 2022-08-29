import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks/redux-hooks";
import {
  fetchPhones,
  getAllOs,
  getAllPhones,
  getAllVendors,
} from "./phonesSlice";
import styles from "./PhonePage.module.css";
import Select from "../../UI/Elements/Select";
import Phone from "./PhoneModel";
import PhoneExcerpt from "./Phone";
import useDebounce from "../../app/hooks/use-debounce";
const PhonePage = () => {
  const storedPhones = useAppSelector(getAllPhones);

  const [search, setSearch] = useState<string>("");
  const debounce = useDebounce(search, 500);
  const operatingSystems = useAppSelector(getAllOs);
  const vendors = useAppSelector(getAllVendors);
  const dispatch = useAppDispatch();
  const [avaliable, setAvaliable] = useState<boolean>(false);
  const osTitle = "Systém";
  const vendorTitle = "Výrobce";
  const [operatingSystem, setOperatingSystem] = useState<string>("Nezáleží");
  const [vendor, setVendor] = useState<string>("Nezáleží");

  useEffect(() => {
    dispatch(fetchPhones());
  }, [dispatch]);

  const isFIltered = (phone: Phone) => {
    return (
      (phone.os === operatingSystem || operatingSystem === "Nezáleží") &&
      (phone.vendor === vendor || vendor === "Nezáleží") &&
      (debounce === "" ||
        phone.model.toLowerCase().includes(debounce.toLowerCase())) &&
      (!avaliable || (phone.borrowed?.user === undefined && avaliable))
    );
  };

  const phonesList = storedPhones
    .filter((phone) => {
      return isFIltered(phone);
    })
    .map((phone) => {
      return <PhoneExcerpt key={phone.id} {...phone} />;
    });

  const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
  };

  const avaliableHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAvaliable((value) => !value);
  };

  return (
    <>
      <div className={styles.filter}>
        <Select
          hasLabel={true}
          title={osTitle}
          options={operatingSystems}
          value={operatingSystem}
          setValue={setOperatingSystem}
        />
        <Select
          hasLabel={true}
          title={vendorTitle}
          options={vendors}
          value={vendor}
          setValue={setVendor}
        />
        <div className="form-control">
          <label htmlFor="avaliable">
            <input
              type="checkbox"
              id="avaliable"
              checked={avaliable}
              onChange={avaliableHandler}
              className={avaliable ? "checked" : ""}
            />
            <span>Jen dostupné</span>
          </label>
        </div>
        <div className={`form-control ${styles.search}`}>
          <input
            type="text"
            id="search"
            placeholder="Vyhledat zařízneí"
            onChange={searchHandler}
          />
        </div>
      </div>
      <div className={styles.dashboard}>{phonesList}</div>
    </>
  );
};

export default PhonePage;
