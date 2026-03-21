// form where user enters machine readings
import { useState } from "react";

const defaultValues = {
    Type: "M",
    Air_temperature_K: 300.0,
    Process_temperature_K: 310.0,
    Rotational_speed_rpm: 1500,
    Torque_Nm: 40.0,
    Tool_wear_min: 100,
};

function InputForm({ onSubmit, loading }) {
    const [formData, setFormData] = useState(defaultValues);

    // This func converts everything to number except Type which stays a string
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "Type" ? value : Number(value),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <label>
                Machine Type:
                <select name="Type" value={formData.Type} onChange={handleChange}>
                    <option value="L">L</option>
                    <option value="M">M</option>
                    <option value="H">H</option>
                </select>
            </label>
            {/* L = Low quality variant
                M = Medium quality variant
                H = High quality variant */}

            <label>
                Air tempertaure (K):
                <input type="number" name="Air_temperature_K" value={formData.Air_temperature_K} onChange={handleChange} step="0.1" />
            </label>

            <label>
                Process Temperature (K):
                <input type="number" name="Process_temperature_K" value={formData.Process_temperature_K} onChange={handleChange} step="0.1" />
            </label>

            <label>
                Rotational Speed (RPM):
                <input type="number" name="Rotational_speed_rpm" value={formData.Rotational_speed_rpm} onChange={handleChange} />
            </label>

            <label>
                Torque (Nm):
                <input type="number" name="Torque_Nm" value={formData.Torque_Nm} onChange={handleChange} step="0.1" />
            </label>

            <label>
                Tool Wear (min):
                <input type="number" name="Tool_wear_min" value={formData.Tool_wear_min} onChange={handleChange} />
            </label>

            {/* Loading disables the button while API call is in progress  */}
            <button type="submit" disabled={loading}>
                {loading ? "Analyzing..." : "Predict"}
            </button>
        </form>
    )
}

export default InputForm;