import React, { useState } from "react";

let therapists;
function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("8");
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [availableTherapists,setAvailableTherapists] = useState();

  const handleDateChange = async (e) => {
    setDate(e.target.value);
    let res = await fetch(`/api/therapists/available-on/${e.target.value}`);
    res = await res.json();
    setAvailableTherapists(res);
    therapists = res;
  }
  const handleTimeChange = (e) => {
    setTime(e.target.value);
    const a = therapists.filter(therapist => {
        let doesDateMatch = therapist.availableAt.find( day => {
          const dateIso = day.date.slice(0,10);
          let doesSlotMatch =  day.intervals.find(interval => {
            const from = Number(interval.from);
            const to = Number(interval.to);
            let availablePeriod = [];
            for(let i = from;i < to; i++){
              availablePeriod.push(i);
            }
            return availablePeriod.includes(Number(e.target.value));
          })
          if(doesSlotMatch && dateIso === date){
            return true
          }
          return false

      })
      console.log("inner")
      console.log(doesDateMatch)
      if(doesDateMatch){
        return true
      }
      return false 
    })
    setAvailableTherapists(a)
    console.log(a)
  }
  const handleTherapistChange = (e) => {
    setSelectedTherapist(e.target.dataset.value)
  }
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let inputDate = [];
    for (var i = 0; i < 3; i++)
      inputDate.push(parseInt(date.split("-")[i]));
    const [year,month,day] = inputDate;
    const convertedDate = new Date(year,month,day,time,0,0);
    
    const rawResponse = await fetch('/api/appointment', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user_name: name,user_email: email,therapist_id: selectedTherapist,appointmentAt: convertedDate})
    });
  }
  return (
    <>
      <form onSubmit={handleFormSubmit} >
      <input
        type="text"
        value={name}
        placeholder="name"
        onChange={(e) => {
          setName(e.target.value);
        }}
        required
      />
      <input
        type="email"
        value={email}
        placeholder="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        required
      />
        <input
          value={date}
          onChange={handleDateChange}
          placeholder="Date"
          type="date"
          name="date"
          required
        />

        <select name="time" id="time" value={time} onChange={handleTimeChange}>
            <option value="8">8:00 am to 9:00 am</option> 
            <option value="9">9:00 am to 10:00 am</option> 
            <option value="10">10:00 am to 11:00 am</option> 
            <option value="11">11:00 am to 12:00 am</option> 
            <option value="12">12:00 pm to 1:00 pm</option>
            <option value="13">01:00 pm to 02:00 pm</option>
            <option value="14">02:00 pm to 03:00 pm</option>
            <option value="15">03:00 pm to 04:00 pm</option>
            <option value="16">04:00 pm to 05:00 pm</option>
        </select>

        <div>   
           {availableTherapists && availableTherapists.map(therapist => {
              return(
                <p onClick={handleTherapistChange} key={therapist._id} data-value={therapist._id}>{therapist.name}</p>
              );
            })}
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
export default Form;