import React from "react"
import { useAppState } from "../context/app state/AppProvider"
import Select from "./inputs/Select"

const SideBar = ({}) => {

    const [{labels}, dispatch] = useAppState()

    const styles = {
        main:``,
    }

  return (
    <div className={styles.main}>
      <Select
      data={{label: "Land Lord", options: ["Elane", "George"]}}
      />
      <Select
      data={{label: "Crop", options: ["Corn", "Beans"]}}
      />
      <Select
      data={{label: "Year", options: []}}
      />
    </div>
  )
}

export default SideBar
