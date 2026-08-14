import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUsers1786595434632 implements MigrationInterface {
    name = 'InitUsers1786595434632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("sub" character varying NOT NULL, "email" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "preferredTime" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2ca016813ffcce3392b3eb8ed0c" PRIMARY KEY ("sub"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
