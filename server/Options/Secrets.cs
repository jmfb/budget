using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Budget.Server.Options;

public class Secrets
{
	public string DatabasePassword { get; set; }
	public string AuthClientSecret { get; set; }
	public string TokenSecret { get; set; }

	public SymmetricSecurityKey Key => new(Encoding.UTF8.GetBytes(TokenSecret));
}
