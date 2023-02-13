import classNames from "classnames/bind";
import styles from "./InputForm.module.scss";

const cx = classNames.bind(styles);
function InputForm({type, placeholder, value, onChange, className, large, small}) {
    const classes = cx("input",{
        [className] : className,
        large,
        small,
    })
  return (
    <input
      type={type}
      placeholder={placeholder}
      className= {classes}
      value={value}
      onChange={onChange}
    />
  );
}

export default InputForm;
