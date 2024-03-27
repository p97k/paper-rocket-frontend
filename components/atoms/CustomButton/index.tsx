import { MouseEventHandler } from "react/index";

interface IButton {
    onClick: MouseEventHandler<HTMLButtonElement>;
    type: "submit" | "reset" | "button";
    styles?: string
    text: string
}

const CustomButton = ({ onClick, type, text, styles }: IButton) => {
    return (
            <button
                className={styles ?? ""}
                type={type}
                onClick={onClick}
            >
                {text}
            </button>
    )
}

export { CustomButton }
