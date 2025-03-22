using System.Collections.Generic;
using Budget.Server.Models;

namespace Budget.Server.Api.Models;

public class GetPendingItemsResponse
{
	public long Version { get; set; }
	public IEnumerable<PendingItem> PendingItems { get; set; }
}
