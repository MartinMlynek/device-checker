import { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks/redux-hooks";
import useInput from "../../app/hooks/use-input";
import { loginUser } from "./authSlice";
import styles from "./LoginPage.module.css";
const isLength = (value: string) => value.trim() !== "" && value.length > 5;
const isEmail = (value: string) => value.includes("@");
const LoginPage = () => {
  const navigate = useNavigate();
  const {
    value: username,
    isValid: usernameIsValid,
    hasError: usernameHasError,
    valueChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
    reset: usernameResetHandler,
  } = useInput(isEmail);
  const {
    value: password,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: passwordResetHandler,
  } = useInput(isLength);

  const usernameClasses = usernameHasError
    ? "form-control invalid"
    : "form-control";
  const passwordClasses = passwordHasError
    ? "form-control invalid"
    : "form-control";

  let formIsValid = false;

  if (usernameIsValid && passwordIsValid) {
    formIsValid = true;
  }

  const dispatch = useAppDispatch();
  const [invalidLoginError, setInvalidLoginError] = useState(false);
  const submitHandler = async (event: SyntheticEvent) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    try {
      await dispatch(loginUser({ login: username, password })).unwrap();
      navigate("/phones");
      usernameResetHandler();
      setInvalidLoginError(false);
    } catch (error) {
      setInvalidLoginError(true);
      console.error(error);
    }
    passwordResetHandler();
  };

  return (
    <div className={styles.container}>
      <h1>Přihlášení</h1>
      <p>
        Po přihlášení si můžete výpujčit telefon, případně vložit nový do
        seznamu
      </p>
      <p className={styles.message}>
        {invalidLoginError && "Vložili jste špatné jméno nebo heslo"}
      </p>
      <form onSubmit={submitHandler}>
        <div className={usernameClasses}>
          <input
            type="text"
            id="name"
            placeholder="Email"
            value={username}
            onChange={usernameChangeHandler}
            onBlur={usernameBlurHandler}
          />
          {usernameHasError && (
            <p className="error-text">Prosím vložte emailovou adresu.</p>
          )}
        </div>
        <div className={passwordClasses}>
          <input
            type="password"
            id="password"
            placeholder="Heslo"
            value={password}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
          />
          {passwordHasError && (
            <p className="error-text">Prosím vložte heslo</p>
          )}
        </div>
        <div>
          <button disabled={!formIsValid} type="submit">
            Přihlásit se
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
