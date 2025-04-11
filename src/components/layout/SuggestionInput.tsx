import { Input } from "@ui/input"
import { Button } from "@ui/button"

import { useState } from "react"
import { UpperFirstLetter } from "@utils/helpers"

// ################################################################################

type SuggestionInputProps = {
  name?: string
  className?: string
  disabled?: boolean
  required?: boolean

  options: any[]
  searchObjectName: string
  displayObjectName: string

  inputValue: string
  onChange: Function
  suggestedNumber: number

  onMouseDownItem: Function
}

export const SuggestionInput = ({
  className,
  required,
  name,
  onChange,
  suggestedNumber,
  disabled,
  options,

  searchObjectName,
  displayObjectName,

  inputValue,

  onMouseDownItem
}: SuggestionInputProps) => {


  const [filteredSuggestionList, setFilteredSuggestionList] = useState(options) // filtered list to display
  const [displayOptions, setDisplayOptions] = useState(false) // display or not the suggestion list

  const onChangeInput = (input: any) => {

    if (input !== "") { // filled, then display something
      setFilteredSuggestionList(options.filter((obj: any) =>
        obj[searchObjectName].includes(input.toLowerCase())).slice(0, suggestedNumber)
      )
    }

    else { // else, display unfiltered first elements from "options" array
      setFilteredSuggestionList(options.slice(0, suggestedNumber))
    }
  }

  const renderSuggestionList = (displayList: any): React.ReactElement[] => {

    const element: React.ReactElement[] = []

    if (displayList.length > 0) {
      displayList.map((item: any) => {
        element.push(
          <SuggestionItem
            onMouseDown={(e: any) => onMouseDownItem(e)}
            key={item.id}
            className="justify-between text-left w-full pl-5 mb-1"
            item={item}
            displayValue={UpperFirstLetter(item[displayObjectName])} // displayed object name
          >
          </SuggestionItem>
        )
      })
    }
    else { element.push(<div key="0"></div >) }
    return element
  }



  return (
    <><Input
      autoComplete="off"
      className={className}
      name={name}
      value={inputValue}
      onChange={(e: any) => {
        onChangeInput(e.target.value)
        onChange(e.target.value)
      }}
      onFocus={() => {
        setDisplayOptions(true)
        if (inputValue === "") { // first render
          setFilteredSuggestionList(options.slice(0, suggestedNumber))
        }

      }}
      onBlur={() => {
        setDisplayOptions(false)
      }}

      required={required}
      disabled={disabled}
    />
      {
        displayOptions ?
          <div className="bg-muted/50">
            {renderSuggestionList(filteredSuggestionList)}
          </div>
          : <></>
      }
    </>
  )

}




// ################################################################################

type SuggestionItemProps = {
  className?: string
  onMouseDown: Function
  displayValue?: string
  item: any
}

const SuggestionItem = ({ className, displayValue, onMouseDown, item}: SuggestionItemProps) => {

  return (
    <Button
      className={className}
      onMouseDown={() => onMouseDown(item)}
      size="icon" variant="link"
    >
      {displayValue}
    </Button>
  )
}

// displayed object name { value}
