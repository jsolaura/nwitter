import React, {useState} from 'react';

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onChange = (event) => {
        const {target: {name, value}} = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
        console.log(event.target.name);
    };

    const onSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type={"text"} name={"email"} onChange={onChange} placeholder={"Email"} value={email} required/>
                <input type={"password"} name={"password"} onChange={onChange} placeholder={"Password"} value={password} required/>
                <input type={"submit"} value={"Log In"} />
            </form>
            <button>Continue with Google</button>
            <button>Continue with Github</button>
        </div>
    );
};

export default Auth;