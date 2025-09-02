const AdjustableParameter = ({ parameter, label, pricePerUnit, unit, defaultValue, value, onUpdate, onReset }) => (
    <div className="d-flex align-items-center flex-column mb-4" style={{ gap: ".5rem" }}>
        <div className="flex align-items-center justify-content-center mb-2" style={{ gap: ".5rem" }}>
            <div className="text-black mb-2 text-xl font-extrabold">{label}:</div>
            <button
                onClick={() => onUpdate(parameter, -1, pricePerUnit)}
                className="bg-[#179ac8] text-white px-3 py-1 rounded hover:bg-[#1482b0]"
            >
                -
            </button>
            <div>
                <span className="fs-3 text-xl font-extrabold">{value}</span> {unit}
            </div>
            <button
                onClick={() => onUpdate(parameter, 1, pricePerUnit)}
                className="bg-[#179ac8] text-white px-3 py-1 rounded hover:bg-[#1482b0]"
            >
                +
            </button>
        </div>
        <button
            className="bg-[#179ac8] text-white px-2 py-1 rounded text-sm hover:bg-[#1482b0]"
            onClick={() => onReset(parameter, defaultValue, pricePerUnit)}
        >
            Reset to Default
        </button>
    </div>
);

export default AdjustableParameter;