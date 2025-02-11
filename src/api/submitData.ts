import axios from "axios";
import { Double } from "react-native/Libraries/Types/CodegenTypes";

// Define the data structure for the API request
interface SubmitDataRequest {
  user_id: number;
  temperature: Double;
  seat_id: number;
}

// Define the response structure (adjust based on your API's response)
interface SubmitDataResponse {
  message: string;
}

export const sendTemperatureData = async (
  user_id: number,
  seat_id: number,
  temperature: Double
) => {
  try {
    const response = await axios.post(
      "https://your-api-id.execute-api.region.amazonaws.com/dev/submitData",
      {
        seat_id,
        temperature,
        user_id,
      }
    );
    console.log("Temperature data sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending temperature data:", error);
  }
};
