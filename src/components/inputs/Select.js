import React from "react"

const Select = ({data}) => {

    const styles = {
        main:``,
    }

  return (
    <div className={styles.main}>
        <h3 className={styles.label}> {data.label} </h3>
        <select className={styles.select}>
            <option>Select Option</option>
            { data?.options.map(option => (
                <option className={styles.option}> {option} </option>
            ))}
        </select>
    </div>
  )
}

export default Select
