export type GetUserFilters = {
  x?: string;
  limit: number;
  page: number;
};

type User = {
  id: number;
  name: string;
  email: string;
};

export async function getUsersAsync(
  filters?: GetUserFilters
): Promise<{ users: User[]; total: number }> {
  const USERS = [
    { id: 21, name: "John Doe", email: "john.doe@example.com" },
    { id: 22, name: "Jane Smith", email: "jane.smith@example.com" },
    { id: 23, name: "Alice Johnson", email: "alice.johnson@example.com" },
    { id: 24, name: "Bob Brown", email: "bob.brown@example.com" },
    { id: 25, name: "Charlie Davis", email: "charlie.davis@example.com" },
    { id: 26, name: "Diana Evans", email: "diana.evans@example.com" },
    { id: 27, name: "Frank Green", email: "frank.green@example.com" },
    { id: 28, name: "Grace Harris", email: "grace.harris@example.com" },
    { id: 29, name: "Hank Irving", email: "hank.irving@example.com" },
    { id: 30, name: "Ivy Johnson", email: "ivy.johnson@example.com" },
    { id: 31, name: "Jack King", email: "jack.king@example.com" },
    { id: 32, name: "Kathy Lee", email: "kathy.lee@example.com" },
    { id: 33, name: "Larry Moore", email: "larry.moore@example.com" },
    { id: 34, name: "Mona Nelson", email: "mona.nelson@example.com" },
    { id: 35, name: "Nina Owens", email: "nina.owens@example.com" },
    { id: 36, name: "Oscar Perez", email: "oscar.perez@example.com" },
    { id: 37, name: "Paula Quinn", email: "paula.quinn@example.com" },
    { id: 38, name: "Quincy Roberts", email: "quincy.roberts@example.com" },
    { id: 39, name: "Rachel Scott", email: "rachel.scott@example.com" },
  ] as User[];
  const filteredUsers = USERS.filter(
    (user) =>
      //filters == null ||
      filters?.x == null ||
      user.name.toLowerCase().includes(filters.x.toLowerCase())
  );
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
  return {
    users: filteredUsers,
    total: filteredUsers.length,
  };
}
