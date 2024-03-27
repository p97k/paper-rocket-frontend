import { ChangeEventHandler } from "react";
import { HTMLInputTypeAttribute } from "react/index";

interface ICustomInput {
    type: HTMLInputTypeAttribute;
    placeholder: string;
    style: string;
    value: string
    onChange: ChangeEventHandler<HTMLInputElement>
}

const CustomInput = ({ type, onChange, value, style, placeholder}: ICustomInput) => {
    return (
            <input
                type={type}
                placeholder={placeholder}
                className={style}
                value={value}
                onChange={onChange}
            />
    )
}

export { CustomInput };
