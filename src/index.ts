import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Analyzer } from './analyzer/analyzer';
import { FlowTracker } from './flow-tracker/flow-tracker';
import { Listener } from './listener/listener';
import { Config } from './shared/config/config';
import { DataType } from './shared/enums/data-type';
import { Modes } from './shared/enums/modes';
import { BehaviorInfo } from './shared/models/behavior-info.model';
import { DataEmitter } from './shared/models/data-emitter.model';
import { EventLog } from './shared/models/event-log.model';
import { EventHandler } from './shared/utils/event-handler';
import { Logger } from './shared/utils/logger';

export class Tuxa extends EventHandler {
	public behaviors$ = new Subject<DataEmitter<BehaviorInfo>>();
	public flowEvents$ = new Subject<DataEmitter<EventLog>>();

	private analyzer: Analyzer;
	private config: Config;
	private flowTracker: FlowTracker;
	private listener: Listener;
	private logger = new Logger();
	private mode: Modes = Modes.SILENT;

	/**
	 * Create a new Tuxa instance, that will have to be started later
	 * Optional config, containing:
	 * - mode: The running mode ('DEBUG', 'SILENT' or 'VERBOSE')
	 * - custom parameters for behaviors
	 * @param config The config for Tuxa
	 */
	constructor(config?: Config) {
		super();

		this.config = config ?? new Config();
		this.mode = this.config.mode;
		this.listener = new Listener(this.logger, this.mode);
		this.analyzer = new Analyzer(this.config, this.listener);
		this.flowTracker = new FlowTracker(this.listener);
	}

	/**
	 * Gets run mode
	 * Possible values are DEBUG, SILENT or VERBOSE.
	 * Avoid using DEBUG as it is attended for development purposes.
	 * SILENT will not log anything.
	 * VERBOSE will log found behaviors in the console.
	 * @returns The mode Tuxa is actually running
	 */
	public getMode(): Modes {
		return this.mode;
	}

	/**
	 * Starts Tuxa
	 * Whenever Tuxa is started, it has to be stopped at some point to avoid memory leaks, as it relies on observables
	 */
	public start(): void {
		this.listener.startListening();
		this.flowTracker.startTracking();
		this.subscribeToAnalyzer();
		this.subscribeToFlowTracker();
		if (this.mode.valueOf() !== Modes.SILENT.valueOf()) {
			this.logger.info(this.config);
		}
	}

	/**
	 * Stops Tuxa
	 * It will unsubscribe to observables and cancel emitter
	 */
	public stop(): void {
		this.unsubscribeAll();
		this.listener.stopListening();
		this.analyzer.stopAnalyzing();
		this.flowTracker.stopTracking();
		this.destroy(this.behaviors$);
		this.destroy(this.flowEvents$);
	}

	private subscribeToAnalyzer(): void {
		this.analyzer.emitter$.pipe(takeUntil(this.unsubscriber$)).subscribe((dE: DataEmitter<BehaviorInfo>) => {
			if (dE.type.valueOf() === DataType.BEHAVIOR.valueOf()) {
				this.emit(this.behaviors$, dE);
				if (this.mode.valueOf() !== Modes.SILENT.valueOf()) {
					this.logger.info(dE.data.name + ' on ' + dE.data.element + ' (' + dE.data.url + ')');
				}
			}
		});
	}

	private subscribeToFlowTracker(): void {
		this.flowTracker.events$.pipe(takeUntil(this.unsubscriber$)).subscribe((eL: DataEmitter<EventLog>) => {
			this.emit(this.flowEvents$, eL);
			if (this.mode.valueOf() !== Modes.SILENT.valueOf()) {
				this.logger.info(eL.data.date + ': ' + eL.data.type);
			}
		});
	}
}
