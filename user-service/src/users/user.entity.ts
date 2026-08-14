// src/users/user.entity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  sub: string; // Auth0's user_id — the key, not an auto-generated one

  @Column()
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  preferredTime: string | null; // null = onboarding not completed yet

  @Column({ type: 'boolean', default: false })
  remindersOptIn: boolean;

  @CreateDateColumn()
  createdAt: Date;
}