import { useField } from "formik";
import { cls } from "../../util/helpers";

export const Input = (props) => {
  const {
    id,
    type = "text",
    className = "",
    onChange,
    placeholder,
    ...rest
  } = props;

  const [field, meta] = useField(props.name);
  const hasError = !!(meta.touched && meta.error);

  return (
    <>
      <input
        id={id}
        type={type}
        {...field}
        placeholder={placeholder}
        className={cls(className, { "border-red-400": hasError })}
        onChange={(e) => field.onChange(e)}
        {...rest}
      />
      {hasError && meta.error?.length && meta.error.length > 0 ? (
        <div className="text-red-500 mt-1 text-sm">{meta.error}</div>
      ) : null}
    </>
  );
};
