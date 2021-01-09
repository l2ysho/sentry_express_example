import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import express from 'express'

const app = express()

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	debug: true,
	integrations: [
		// enable HTTP calls tracing
		new Sentry.Integrations.Http({ tracing: true }),
		// enable Express.js middleware tracing
		new Tracing.Integrations.Express({
			// to trace all requests to the default router
			app,
			// alternatively, you can specify the routes you want to trace:
			// router: someRouter,
		}),
	],

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 1.0,
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

// the rest of your app
app.get('/', (req, res) => {
	res.end('Hello world!')
})


app.use(Sentry.Handlers.errorHandler())
app.listen(3000)
