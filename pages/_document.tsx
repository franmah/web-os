import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { resetServerContext } from 'react-beautiful-dnd';

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		await ctx.renderPage();
		const initialProps = await Document.getInitialProps(ctx);
		resetServerContext();
		return { ...initialProps };
	}

	render() {
		return (
			<Html>
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
