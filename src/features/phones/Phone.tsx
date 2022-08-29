import Phone from "./PhoneModel";
import styles from "./Phone.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks/redux-hooks";
import { borrowPhone, returnPhone } from "./phonesSlice";
import { getUser } from "../auth/authSlice";
const NOT_FOUND_URL =
  "https://aeroclub-issoire.fr/wp-content/uploads/2020/05/image-not-found.jpg";

const PhoneExcerpt = ({
  vendor,
  borrowed,
  image,
  model,
  os,
  osVersion,
  id,
}: Phone) => {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector(getUser);
  const mobile = `${vendor} ${model}`;
  const osText = `${os}/${osVersion}`;
  const isBorrowed = borrowed !== undefined;

  const isDisabled = isBorrowed && borrowed.user.id !== loggedUser?.id;
  const borrowHandler = () => {
    if (!isBorrowed) {
      dispatch(borrowPhone(id));
    } else {
      dispatch(returnPhone(id));
    }
  };
  return (
    <div className={styles.phone}>
      <div className={styles.image}>
        <img
          src={image ? image : NOT_FOUND_URL}
          alt={image ? mobile : "Not found"}
        />
        {isBorrowed && (
          <span className={styles.borrowed}>{`${
            borrowed.user.name
          } - ${new Date(borrowed.date).toLocaleString([], {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}`}</span>
        )}
      </div>
      <div className={styles.content}>
        <h3>{model}</h3>
        <h4>{vendor}</h4>
        <p>{osText}</p>
        <button
          className={styles.button}
          disabled={isDisabled}
          onClick={borrowHandler}
        >
          {isBorrowed && !isDisabled ? "Vrátit" : "Půjčit"}
        </button>
      </div>
    </div>
  );
};

export default PhoneExcerpt;
