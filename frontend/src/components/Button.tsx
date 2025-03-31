import { ReactElement } from "react";


interface ButtonProps {
    variant: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
    text:string;
    startIcon?: ReactElement;
    endIcon?: any;
    onClick? : () => void;
}


const variantClasses ={
    "primary" : "bg-black text-white",
    "secondary": "bg-gray-300  text-black",
};

const defaultStyles  = "flex justify-center items-center px-4 py-2 rounded-md font-light"
export const Button = ({variant, text, startIcon}:ButtonProps) =>{
    return <button className= {variantClasses[variant]+ " " + defaultStyles}>
        <div className="p-2">
        {startIcon}
        </div>
         {text}
         </button>
}

{/* <Button variants= "primary" size ="md" onClick={()=>{}} text={"button"} /> */}