export interface JobExecutor {
    execute(fireDate: Date): Promise<void>;
}