import "./booking.css";
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  UnorderedList,
  ListItem,
  ListIcon,
  List,
  useToast
} from "@chakra-ui/react";
import { CheckIcon } from '@chakra-ui/icons'


const Booking = () => {
    const [bookedFacilities, setBookedFacilities] = useState([]);
    const [facility, setFacility] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [bookingStatus, setBookingStatus] = useState("");
    const [bookingCost, setBookingCost] = useState(0);
    const [formError, setFormError] = useState("");
    const toast = useToast()
  const statuses = ['success', 'error', 'warning', 'info']


  const facilitiesConfig = [
    {
      name: "Clubhouse",
      slots: ["10:00 - 16:00", "16:00 - 22:00"],
      cost: [100, 500],
    },
    { name: "Tennis Court", slots: ["00:00 - 23:59"], cost: [50] },
  ];

  const handleBooking = () => {
    if (!facility) {
        setFormError("Please select a facility.");
        return;
      }
  
      if (!date) {
        setFormError("Please select a date.");
        return;
      }
  
      if (!startTime || !endTime) {
        setFormError("Please select both start and end times.");
        return;
      }
  
    // Check for conflicts with existing bookings
    const conflict = bookedFacilities.find(
      (booking) =>
        booking.facility === facility &&
        booking.date === date &&
        ((startTime >= booking.startTime && startTime < booking.endTime) ||
          (endTime > booking.startTime && endTime <= booking.endTime))
    );

    if (conflict) {
      setBookingStatus("Booking Failed, Already Booked");
      toast({
        title:"Booking Failed, Already Booked",
        status: "waring",
        isClosable: true,
      })
      alert("Booking Failed, Already Booked");
      setBookingCost(0);
      return;
    }

    // Find the selected facility config
    const facilityConfig = facilitiesConfig.find(
      (config) => config.name === facility
    );

    // Calculate the cost based on time slots
    let cost = 0;
    for (let i = 0; i < facilityConfig.slots.length; i++) {
      const [start, end] = facilityConfig.slots[i].split(" - ");
      if (startTime >= start && endTime <= end) {
        cost = facilityConfig.cost[i];
        break;
      }
    }

    // Add the booking to the state
    const newBooking = {
      facility,
      date,
      startTime,
      endTime,
      cost,
    };
    setBookedFacilities([...bookedFacilities, newBooking]);
    setBookingStatus("Booked");
    setBookingCost(cost);
  };

  return (
    <Box maxW="600px" mx="auto" p="20px" fontFamily="Arial, sans-serif">
      <Text as="h1" textAlign="center" mb="20px">
        Facility Booking
      </Text>
      <Stack spacing={3}>
      {formError && <Text color="red">{formError}</Text>}
        <FormControl>
          <FormLabel>Facility:</FormLabel>
          <Select
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
          >
            <option value="">Select a facility</option>
            {facilitiesConfig.map((config) => (
              <option key={config.name} value={config.name}>
                {config.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Date:</FormLabel>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Start Time:</FormLabel>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>End Time:</FormLabel>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleBooking}>
          Book Facility
        </Button>
        <Text>Status: {bookingStatus}</Text>
        <Text>Cost: Rs. {bookingCost}</Text>
        <Text as="h2">Currently Booked Facilities:</Text>
        <List border={"3px solid gray"}>
          {bookedFacilities.map((booking, index) => (
            <ListItem key={index}>
                <ListIcon as={CheckIcon} color='green' />   &nbsp;&nbsp;
              {booking.facility}, {booking.date}, {booking.startTime} -{" "}
              {booking.endTime}, Rs. {booking.cost}
            </ListItem>
          ))}
        </List>
      </Stack>
    </Box>
  );
};

export default Booking;
