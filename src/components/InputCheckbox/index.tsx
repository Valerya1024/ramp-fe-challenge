import classNames from "classnames"
import { useRef } from "react"
import { InputCheckboxComponent } from "./types"

export const InputCheckbox: InputCheckboxComponent = ({ id, checked = false, disabled, onChange }) => {
  const { current: inputId } = useRef(`RampInputCheckbox-${id}`)
  const handleChange = () => {
    //console.log(["handle change", checked, disabled])
    onChange(!checked)
  }
  return (
    <div className="RampInputCheckbox--container" data-testid={inputId}>
      <label
        id={inputId}
        className={classNames("RampInputCheckbox--label", {
          "RampInputCheckbox--label-checked": checked,
          "RampInputCheckbox--label-disabled": disabled,
        })}
        onClick={handleChange}
      />
      {/* <input
        id={inputId}
        type="checkbox"
        className={"RampInputCheckbox--input"}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      /> */}
    </div>
  )
}
