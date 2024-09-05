import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import axios from "axios";
import { Workout } from "@/types/workout.types";

interface WorkoutContextType {
  workouts: Workout[];
  fetchWorkouts: (page?: number) => Promise<void>;
  noMoreData: boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [noMoreData, setNoMoreData] = useState<boolean>(false);

  const fetchWorkouts = async (page: number = 1) => {
    try {
      const response = await axios.get(
        `https://app.onemor.com/api/workout-feed?query=&page=${page}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_TOKEN}`,
          },
        }
      );
      if (response.data.data) {
        const newWorkouts = response.data.data.filter(
          (workout: Workout) => workout.routines && workout.routines.length > 0
        );
        if (newWorkouts.length === 0) {
          setNoMoreData(true);
        } else {
          setWorkouts((prev) => [...prev, ...newWorkouts]);
        }
      }
    } catch (error) {
      console.log("Failed to fetch workouts:", error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <WorkoutContext.Provider value={{ workouts, fetchWorkouts, noMoreData }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};
