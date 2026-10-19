import { useEffect, useState } from "react";
import { getActivities } from "../../api/activities";
import { addSet } from "../../api/sets";
import { useAuth } from "../../auth/AuthContext";

export default function SetForm({ routineId, syncRoutine }) {
  const [activities, setActivities] = useState([]);
  const syncActivities = async () => {
    const data = await getActivities();
    setActivities(data);
  };
  useEffect(() => {
    syncActivities();
  }, []);

  const { token } = useAuth();
  const [error, setError] = useState();

  const tryAddSet = async (formData) => {
    setError(null);

    const activityId = formData.get("activityId");

    const count = +formData.get("count");

    try {
      await addSet(token, activityId, routineId, count);
      syncRoutine(routineId);
    } catch (e) {
      setError(e);
    }
  };

  return (
    <section>
      <h2>Add a set</h2>
      <form action={tryAddSet}>
        <label>
          Activity
          <select name="activityId">
            {activities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Count
          <input type="number" name="count" />
        </label>
        <button type="submit">Add set</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
