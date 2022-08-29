import { SyntheticEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks/redux-hooks";
import useInput from "../../app/hooks/use-input";
import Select from "../../UI/Elements/Select";
import { isNotEmpty, isNotTitle } from "../../utility/validators";
import styles from "./CreatePhonePage.module.css";
import {
  addPhone,
  fetchPhones,
  getAllOs,
  getAllPhones,
  getAllVendors,
} from "./phonesSlice";

const CreatePhonePage = (): JSX.Element => {
  const {
    value: modelName,
    isValid: modelNameIsValid,
    hasError: modelNameHasError,
    inputClasses: modelNameClasses,
    valueChangeHandler: modelNameChangeHandler,
    inputBlurHandler: modelNameBlurHandler,
    reset: modelNameResetHandler,
  } = useInput(isNotEmpty);

  const {
    value: code,
    isValid: codeIsValid,
    hasError: codeHasError,
    inputClasses: codeClasses,
    valueChangeHandler: codeChangeHandler,
    inputBlurHandler: codeBlurHandler,
    reset: codeResetHandler,
  } = useInput(isNotEmpty);
  const {
    value: osVersion,
    isValid: osVersionIsValid,
    hasError: osVersionHasError,
    inputClasses: osVersionClasses,
    valueChangeHandler: osVersionChangeHandler,
    inputBlurHandler: osVersionBlurHandler,
    reset: osVersionResetHandler,
  } = useInput(isNotEmpty);
  const {
    value: imgUrl,
    isValid: imgUrlIsValid,
    hasError: imgUrlHasError,
    inputClasses: imgUrlClasses,
    valueChangeHandler: imgUrlChangeHandler,
    inputBlurHandler: imgUrlBlurHandler,
    reset: imgUrlResetHandler,
  } = useInput((_: string) => {
    return true;
  });

  const osTitle = "Systém";
  const {
    value: operatingSystem,
    isValid: operatingSystemIsValid,
    hasError: operatingSystemHasError,
    inputClasses: operatingSystemClasses,
    setValueHandler: operatingSystemSetValue,
    inputBlurHandler: operatingSystemBlurHandler,
    reset: operatingSystemResetHandler,
  } = useInput(isNotTitle(osTitle), osTitle);

  const vendorTitle = "Výrobce";
  const {
    value: vendor,
    isValid: vendorIsValid,
    hasError: vendorHasError,
    inputClasses: vendorClasses,
    setValueHandler: vendorSetValue,

    inputBlurHandler: vendorBlurHandler,
    reset: vendorResetHandler,
  } = useInput(isNotTitle(vendorTitle), vendorTitle);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const operatingSystemsOptions = useAppSelector(getAllOs);
  const vendorsOptions = useAppSelector(getAllVendors);
  const dispatch = useAppDispatch();
  const phones = useAppSelector(getAllPhones);

  useEffect(() => {
    if (phones.length === 0) {
      dispatch(fetchPhones());
    }
  }, [dispatch, phones.length]);
  let formIsValid = false;

  if (
    codeIsValid &&
    modelNameIsValid &&
    osVersionIsValid &&
    imgUrlIsValid &&
    operatingSystemIsValid &&
    vendorIsValid
  ) {
    formIsValid = true;
  }

  const submitHandler = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }

    try {
      await dispatch(
        addPhone({
          code: code,
          model: modelName,
          osVersion: osVersion,
          vendor: vendor!,
          os: operatingSystem!,
          image: imgUrl,
        })
      ).unwrap();
      setFormSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      operatingSystemResetHandler();
      vendorResetHandler();
      modelNameResetHandler();
      codeResetHandler();
      imgUrlResetHandler();
      osVersionResetHandler();
    }
  };

  /* const operatingSystemHandler = (value: string, isValid: boolean) => {
    formIsValid = formIsValid && isValid;
    setOperatingSystem(value);
  };
  const vendorHandler = (value: string, isValid: boolean) => {
    formIsValid = formIsValid && isValid;
    setVendor(value);
  }; */

  return (
    <div className={styles.formContainer}>
      <h1>Nové zařízení</h1>
      <p className={styles.message}>
        {formSubmitted && "Nové zařízení bylo přidáno"}
      </p>
      <form onSubmit={submitHandler}>
        <div className={codeClasses}>
          <input
            type="text"
            placeholder="Kódové označení (identifikátor)"
            value={code}
            onChange={codeChangeHandler}
            onBlur={codeBlurHandler}
          />
          {codeHasError && (
            <p className="error-text">Prosím vložte kódové označení.</p>
          )}
        </div>
        {/* Select Výrobce */}
        <div className={modelNameClasses}>
          <input
            placeholder="Model"
            type="text"
            value={modelName}
            onChange={modelNameChangeHandler}
            onBlur={modelNameBlurHandler}
          />
          {modelNameHasError && (
            <p className="error-text">Prosím vložte jméno modelu.</p>
          )}
        </div>
        {/* Operační systém */}
        <Select
          hasLabel={false}
          title={osTitle}
          options={operatingSystemsOptions}
          inFormProps={{
            inputBlurHandler: operatingSystemBlurHandler,
            inputClasses: operatingSystemClasses,
            errorMessage: "Prosím vyberte operační systém",
            hasError: operatingSystemHasError,
          }}
          setValue={operatingSystemSetValue}
          value={operatingSystem}
        />
        <Select
          hasLabel={false}
          title={osTitle}
          options={vendorsOptions}
          inFormProps={{
            hasError: vendorHasError,
            errorMessage: "Prosím vyberte výrobce",
            inputClasses: vendorClasses,
            inputBlurHandler: vendorBlurHandler,
          }}
          setValue={vendorSetValue}
          value={vendor}
        />
        {/* <Select
          formSubmitted={formSubmitted}
          isFilter={false}
          hasLabel={false}
          title="Výrobce"
          options={vendors}
          optionHandler={vendorHandler}
        /> */}
        <div className={osVersionClasses}>
          <input
            placeholder="Verze operačního systému"
            type="text"
            value={osVersion}
            onChange={osVersionChangeHandler}
            onBlur={osVersionBlurHandler}
          />
          {osVersionHasError && (
            <p className="error-text">Prosím vložte verzi systému.</p>
          )}
        </div>
        <div className={imgUrlClasses}>
          <input
            placeholder="URL adresa obrázku"
            type="text"
            value={imgUrl}
            onChange={imgUrlChangeHandler}
            onBlur={imgUrlBlurHandler}
          />
          {imgUrlHasError && (
            <p className="error-text">Prosím vložte adresu obrázku.</p>
          )}
        </div>
        <div>
          <button disabled={!formIsValid} type="submit">
            Odeslat
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePhonePage;
