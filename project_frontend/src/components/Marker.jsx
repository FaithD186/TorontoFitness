import * as React from "react";
import '../style.css';

const Marker = (props: any) => {
    const { color, name, id, text } = props;
    return (
        <>
        <div className="pin"
             style={{ backgroundColor: color}}
             title={name}
        />
        <p className="text-right" style={{ color: "blue"}}>.  {text}</p>
        <div />
        </>
    );
};

export default Marker;