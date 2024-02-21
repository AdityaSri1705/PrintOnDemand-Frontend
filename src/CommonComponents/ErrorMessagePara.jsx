import {useEffect, useState} from "react";

export default function ErrorMessagePara({errorType}) {
    const [message, setMessage] = useState('');

    useEffect(() => {
        switch (errorType) {
            case 'required':
                setMessage("This field is required");
                break;
            case 'minLength':
                setMessage("This field is required min length");
                break;
            default:
                break;

        }
    }, [errorType]);

    return (<>{message && message.length > 0 && <p className={"error-message"}>{message}</p>}</>)
}