import db from '../configs/database';
import bcrypt from 'bcrypt';

async function main() {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('myPassword', salt);

  const user = await db.user.create({
    data: {
      email: 'admin@mail.com',
      name: 'John Doe',
      password: password,
    },
  });
  console.log(user);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
