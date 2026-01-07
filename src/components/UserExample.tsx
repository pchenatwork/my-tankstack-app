import { useQuery } from "@tanstack/react-query";
import { getUsersAsync } from "../apis/user";
import useUserStore from "../stores/userStore";
import { useState } from "react";

/**
 * Example of useQuery (Server State) with Zustand (Client State)
 * @returns 
 */
export const UserExample: React.FC = () => {
    const {filters, setFilters} = useUserStore();
    const { data} = useQuery({
        queryKey:['users', filters],
        queryFn: () => getUsersAsync(filters),
    });
    return <><FiltersComponent />
    {data?.users.map(user => <div key={user.id}>{user.id} - {user.name}</div>)}
    {`Total Users: ${data?.total}`}
    </>;
}

function FiltersComponent() {
    const setFilters = useUserStore(state => state.setFilters);
    // 1. Declare a state variable to hold the input value.
  const [inputValue, setInputValue] = useState('');

  // 2. Event handler for when the input value changes (controlled component).
  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  // 3. Event handler for the button click (or form submission).
  const handleButtonClick = () => {
    
        setFilters({ x: inputValue, limit: 10, page: 1 });

  }

    // im some for inpute
    return (<div>
      <input
        type="text"
        value={inputValue} // The value is controlled by the state
        onChange={handleInputChange} // Update state on every keystroke
        placeholder="Enter text here"
      />
      <button onClick={handleButtonClick}>
        Submit
      </button>
    </div>);
}