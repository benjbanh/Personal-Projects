import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import './App.css';

function App() {
    const styles = useSpring({
        from: { transform: 'translateY(0px)' },
        to: async (next) => {
            while (true) {
                await next({ transform: 'translateY(-150px)' });
                await next({ transform: 'translateY(0px)' });
            }
        },
        config: { tension: 170, friction: 10 },
    });

    return (
        <div className="App">
            <animated.div className="ball" style={styles}></animated.div>
        </div>
    );
}

export default App;
