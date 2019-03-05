import React from "react";
import uniqueId from "lodash/uniqueId";
import { useTransition, animated } from "react-spring";
import { Container, NotificationWrapper } from "./styles";
import Notification from "./Notification";
import Context from "./context";
export { default as useNotifications } from "./useNotifications";
export { default as withNotifications } from "./withNotifications";

export const NotificationsProvider = ({ children }) => {
  const [queue, setQueue] = React.useState([]);

  const notify = content => {
    const id = uniqueId("notification");
    setQueue(items => [...items, { id, content }]);
    setTimeout(() => remove(id), 3000);
  };

  const remove = id => {
    setQueue(items => items.filter(i => i.id !== id));
  };

  console.log(queue);
  const transitions = useTransition(
    queue,
    item => {
      return item.id;
    },
    {
      from: { transform: "translate3d(100%, 0, 0)", opacity: 0 },
      enter: { transform: "translate3d(0, 0, 0)", opacity: 1 },
      leave: { transform: "translate3d(100%, 0, 0)", opacity: 0 }
    }
  );

  return (
    <Context.Provider value={{ notify }}>
      <Container>
        {transitions.map(({ item, props, key }) => {
          return (
            <animated.div key={key} style={props}>
              <Notification {...item} />
            </animated.div>
          );
        })}
      </Container>
      <React.Fragment>{children}</React.Fragment>
    </Context.Provider>
  );
};

export default Context.Consumer;
