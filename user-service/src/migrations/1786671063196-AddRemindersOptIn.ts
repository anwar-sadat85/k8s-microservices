import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRemindersOptIn1786671063196 implements MigrationInterface {
    name = 'AddRemindersOptIn1786671063196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "remindersOptIn" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "remindersOptIn"`);
    }

}
