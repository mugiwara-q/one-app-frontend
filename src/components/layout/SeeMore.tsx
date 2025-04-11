import React, { useState, ReactNode, createContext, useContext } from 'react';

/***************** SEE MORE *****************/
interface SeeMoreContextProps {
  activeValue: string
  setActiveValue: (value: string) => void
}

const SeeMoreContext = createContext<SeeMoreContextProps | undefined>(undefined)

interface SeeMoreProps {
  defaultValue: string
  className?: string
  children: ReactNode
}

export const SeeMore: React.FC<SeeMoreProps> = ({ className, defaultValue, children }) => {
  const [activeValue, setActiveValue] = useState(defaultValue);

  return (
    <SeeMoreContext.Provider value={{ activeValue, setActiveValue }}>
      <div className={className}> {children} </div>
    </SeeMoreContext.Provider>
  )
}

export const useSeeMore = () => {
  const context = useContext(SeeMoreContext);
  if (!context) {
    throw new Error('UseSeeMore must be used within a SeeMoreProvider')
  }
  return context;
}

/***************** SEE LIST *****************/
interface SeeListProps {
  className?: string;
  children: React.ReactNode;
}

const SeeList: React.FC<SeeListProps> = ({ className, children }) => {
  return <div className={className}>{children}</div>;
}

/***************** SEE TRIGGER *****************/
interface SeeTriggerProps {
  className?: string
  onClick?: Function
  value: string
  children: React.ReactNode
}

const SeeTrigger: React.FC<SeeTriggerProps> = ({ className, onClick, value, children }) => {
  const { setActiveValue } = useSeeMore()
  //const isActive = value === activeValue

  return (
    <div
      className={className}
      //style={{ cursor: 'pointer', fontWeight: isActive ? 'bold' : 'normal' }}
      onClick={() => {
        if (onClick) { onClick() } // prevent undefined
        setActiveValue(value)
      }}
    >
      {children}
    </div>
  )
}

/***************** SEE COMPONENT *****************/
interface SeeComponentProps {
  className?: string
  value: string
  children: React.ReactNode
}

const SeeComponent: React.FC<SeeComponentProps> = ({ className, value, children }) => {
  const { activeValue } = useSeeMore()
  return activeValue === value ? <div className={className}>{children}</div> : null
}

export { SeeList, SeeTrigger, SeeComponent }
