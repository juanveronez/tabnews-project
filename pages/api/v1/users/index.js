import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.options);

async function postHandler(request, response) {
  const { username, email, password } = request.body;
  const newUser = await user.create({ username, email, password });

  return response.status(201).json(newUser);
}
