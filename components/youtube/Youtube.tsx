import { FC } from 'react';
import styles from './youtube.module.scss';

const Youtube: FC<{ params: any }> = () => {
	return (
		<iframe
			className={styles.video}
			width='100%'
			height='100%'
			src='https://www.youtube.com/embed/XXYlFuWEuKI'
			title='YouTube video player'
			allowFullScreen
		></iframe>
	);
};

export default Youtube;
