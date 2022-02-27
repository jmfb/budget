using System.Text.Json.Serialization;

namespace Budget.Server.Models {
	public class UserInfoModel {
		[JsonPropertyName("email")]
		public string Email { get; set; }
	}
}
