import "./styles.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

export default function App() {
  return (
    <div className="App container mt-5">
      <h1>Web Notification API Playground</h1>
      {!("Notification" in window) ? (
        <div className="alert alert-warning">
          This API is not supported on IE and Safari on iOS. <br />
          <a
            className="alert-link"
            href="https://developer.mozilla.org/en-US/docs/Web/API/notification"
          >
            MDN Reference
          </a>
        </div>
      ) : (
        <NotificationOK />
      )}
    </div>
  );
}

function NotificationOK() {
  const [
    notificationPermissionStatus,
    setNotificationPermissionStatus
  ] = useState();
  useEffect(() => {
    setNotificationPermissionStatus(Notification.permission);
  }, []);
  const NotificationPermissionStatus = () => {
    return (
      <>
        <div className="row align-items-start justify-content-start">
          <p className="col-auto">Permission Status:</p>
          <span
            className={`badge bg-${
              notificationPermissionStatus === "granted"
                ? "success"
                : notificationPermissionStatus === "denied"
                ? "danger"
                : "warning text-dark"
            } col-auto`}
          >
            {notificationPermissionStatus}
          </span>
        </div>
        {notificationPermissionStatus === "default" && (
          <RequestNotificationPermission className="col-auto" />
        )}
      </>
    );
  };

  const RequestNotificationPermission = ({ className }) => {
    return (
      <button
        type="button"
        className={`btn btn-primary ${className}`}
        onClick={() => {
          Notification.requestPermission().then(
            setNotificationPermissionStatus
          );
        }}
      >
        Grant Permission
      </button>
    );
  };

  return (
    <>
      <NotificationPermissionStatus />
      {notificationPermissionStatus === "granted" && (
        <>
          <CreateNotification />
        </>
      )}
    </>
  );
}

const CreateNotification = () => {
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationWithIcon, setNotificationWithIcon] = useState(false);
  const [notificationDescription, setNotificationDescription] = useState("");
  const [notificationList, setNotificationList] = useState([]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const notification = new Notification(notificationTitle, {
            icon:
              notificationWithIcon && "https://source.unsplash.com/100x100/",
            body: notificationDescription ?? undefined
          });

          setNotificationList((e) => [notification, ...e]);
          notification.onclose = () => {
            const index = notificationList.findIndex(() => e === notification);
            setNotificationList((list) => [
              ...list.slice(0, index),
              ...list.slice(index + 1)
            ]);
          };
          console.info(notification);
        }}
      >
        <h2>Create Notification</h2>
        <label htmlFor="notification_title_form" className="form-label">
          Title (required)
        </label>
        <input
          type="text"
          className="form-control"
          id="notification_title_form"
          onChange={(e) => setNotificationTitle(e.target.value)}
          required
        />

        <label htmlFor="exampleFormControlTextarea1" className="form-label">
          Description
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          value={notificationDescription}
          onChange={(e) => setNotificationDescription(e.target.value)}
        />

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value={notificationWithIcon}
            id="flexCheckDefault"
            onChange={(e) => setNotificationWithIcon(e.target.checked)}
          />
          <label className="form-check-label" for="flexCheckDefault">
            With icon from <a href="https://unsplash.com/">unsplash</a>
          </label>
        </div>
        <button type="submit" className={`btn btn-primary mt-3`}>
          Create
        </button>
      </form>
      <div className="mt-5">
        <h2>Created Notifications</h2>
        {notificationList.length ? (
          <div className="card">
            <ul className="list-group list-group-flush">
              {notificationList.map((notification, index) => (
                <li className="list-group-item" key={index}>
                  <div className="row align-items-center">
                    <div className="col">{notification.title}</div>
                    <button
                      type="button"
                      className="btn btn-danger col-auto"
                      onClick={() => {
                        notification.close();
                        setNotificationList((e) => [
                          ...e.slice(0, index),
                          ...e.slice(index + 1)
                        ]);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="alert alert-info" role="alert">
            No notification.
          </div>
        )}
      </div>
    </>
  );
};
