import { MODULE_NAME } from '../constants';
import { PrivateSettingKeys } from '../settings';
import { getModuleSetting } from '../utils';
import migration1 from './migration_1';

export default async function performMigrations() {
  const lastMigration = getModuleSetting(PrivateSettingKeys.LAST_MIGRATION) as number;

  const allMigrations = [migration1];

  const migrationsToRun = allMigrations.slice(lastMigration);

  for (let i = 0; i < migrationsToRun.length; i++) {
    await migrationsToRun[i]();
    await game.settings.set(
      MODULE_NAME,
      PrivateSettingKeys.LAST_MIGRATION,
      allMigrations.indexOf(migrationsToRun[i]) + 1,
    );
  }
}
