import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../../config";

const TaskAssignmentPanel = ({ task, onAssigned, onClose }) => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [assigningId, setAssigningId] = useState("");
  const panelRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [onClose]);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      setMessage("");

      try {
        const response = await axios.get(BACKEND_URL + "user/members", {
          params: search ? { search } : undefined,
          withCredentials: true,
        });

        setMembers(response.data?.members || []);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load members.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [search]);

  const handleAssign = async (userId) => {
    setAssigningId(userId);
    setMessage("");

    try {
      const response = await axios.post(
        BACKEND_URL + "task/assign",
        {
          taskId: task._id,
          userId,
        },
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        onAssigned(response.data.task);
        onClose();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to assign task.");
    } finally {
      setAssigningId("");
    }
  };

  return (
    <div className="assign-panel" ref={panelRef}>
      <label className="assign-panel-label" htmlFor={`assign-search-${task._id}`}>
        Search members by name
      </label>
      <input
        className="assign-search-input"
        id={`assign-search-${task._id}`}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search team members"
        type="text"
        value={search}
      />

      {message ? <div className="status-message">{message}</div> : null}

      <div className="assign-results">
        {isLoading ? (
          <div className="meta-pill">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="meta-pill">No results found.</div>
        ) : (
          members.map((member) => (
            <div className="assign-result" key={member._id}>
              <div>
                <div className="assign-result-name">{member.name}</div>
                <div className="assign-result-email">{member.email}</div>
              </div>
              <button
                className="btn-secondary"
                disabled={assigningId === member._id}
                onClick={() => handleAssign(member._id)}
                type="button"
              >
                {assigningId === member._id ? "Saving..." : "Assign"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskAssignmentPanel;
